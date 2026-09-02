"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet";

const NavLink = ({ href, children, className }: { href: string; children: React.ReactNode, className?: string }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Link
            href={href}
            className={cn(
                "text-sm font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                className
            )}
        >
            {children}
        </Link>
    );
};

const navItems = [
    { href: `/`, label: 'Home' },
    { href: `/careers/open-positions`, label: 'Open Positions' },

];

const careersSubItems = [
    { href: `/careers/hiring-process`, label: 'Hiring Process' },
    { href: `/careers/hiring-strategy`, label: 'Hiring Strategy' },
    { href: `/careers/life-at-baalvion`, label: 'Life at Baalvion' },
];

const aboutSubItems = [
    { href: `/about`, label: 'About Us' },
    { href: `/new-skills`, label: 'New Skills' },
    { href: `/about/team`, label: 'Meet the Team' },
    { href: `/about/diversity`, label: 'Diversity & Inclusion' },
];

const joinUsSubItems = [
    { href: `/careers/internship-program`, label: 'Internship Program' },
    { href: `/careers/full-time`, label: 'Full-Time Roles' },
    { href: `/careers/part-time`, label: 'Part-Time Roles' },
];

export function PublicHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isAboutActive = aboutSubItems.some(item => pathname === item.href);
    const isJoinUsActive = joinUsSubItems.some(item => pathname === item.href);

    return (
        <header className={cn(
            "sticky top-0 z-50 transition-all duration-300 w-full",
            isScrolled ? "bg-background/80 backdrop-blur-lg border-b" : "bg-transparent"
        )}>
            <div className="container mx-auto flex h-20 items-center justify-between">
                <Link href={`/`}>
                    <Logo />
                </Link>

                {isMounted ? (
                    <>
                        <nav className="hidden md:flex items-center gap-8">
                            {navItems.map((item) => <NavLink key={item.label} href={item.href}>{item.label}</NavLink>)}
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger className={cn("flex items-center gap-1 text-sm font-medium transition-colors outline-none", isAboutActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}>
                                    Careers <ChevronDown className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {careersSubItems.map((subItem) => (
                                        <DropdownMenuItem key={subItem.label} asChild>
                                            <Link href={subItem.href}>{subItem.label}</Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger className={cn("flex items-center gap-1 text-sm font-medium transition-colors outline-none", isAboutActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}>
                                    About Us <ChevronDown className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {aboutSubItems.map((subItem) => (
                                        <DropdownMenuItem key={subItem.label} asChild>
                                            <Link href={subItem.href}>{subItem.label}</Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger className={cn("flex items-center gap-1 text-sm font-medium transition-colors outline-none", isJoinUsActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}>
                                    Join Us <ChevronDown className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {joinUsSubItems.map((subItem) => (
                                        <DropdownMenuItem key={subItem.label} asChild>
                                            <Link href={subItem.href}>{subItem.label}</Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <NavLink href="/placement" className="font-semibold text-primary">Campus Placement</NavLink>
                        </nav>

                        <div className="hidden md:flex items-center gap-2">
                            <Button variant="outline" asChild>
                                <Link href="/login">Admin Panel</Link>
                            </Button>
                        </div>

                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-full max-w-sm">
                                    <div className="p-4 border-b h-20 flex items-center">
                                        <SheetClose asChild>
                                            <Link href="/">
                                                <Logo />
                                            </Link>
                                        </SheetClose>
                                    </div>
                                    <nav className="flex flex-col gap-4 p-4">
                                        {navItems.map((item) => (
                                            <SheetClose asChild key={item.label}>
                                                <Link href={item.href} className="text-base font-medium">
                                                    {item.label}
                                                </Link>
                                            </SheetClose>
                                        ))}
                                        <Collapsible>
                                            <CollapsibleTrigger className="flex items-center justify-between w-full text-base font-medium">
                                                Careers <ChevronDown className="h-4 w-4" />
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="pl-4 mt-2 flex flex-col gap-2">
                                                {careersSubItems.map((item) => (
                                                    <SheetClose asChild key={item.label}>
                                                        <Link href={item.href} className="text-base text-muted-foreground">
                                                            {item.label}
                                                        </Link>
                                                    </SheetClose>
                                                ))}
                                            </CollapsibleContent>
                                        </Collapsible>
                                        <Collapsible>
                                            <CollapsibleTrigger className="flex items-center justify-between w-full text-base font-medium">
                                                About Us <ChevronDown className="h-4 w-4" />
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="pl-4 mt-2 flex flex-col gap-2">
                                                {aboutSubItems.map((item) => (
                                                    <SheetClose asChild key={item.label}>
                                                        <Link href={item.href} className="text-base text-muted-foreground">
                                                            {item.label}
                                                        </Link>
                                                    </SheetClose>
                                                ))}
                                            </CollapsibleContent>
                                        </Collapsible>
                                        <Collapsible>
                                            <CollapsibleTrigger className="flex items-center justify-between w-full text-base font-medium">
                                                Join Us <ChevronDown className="h-4 w-4" />
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="pl-4 mt-2 flex flex-col gap-2">
                                                {joinUsSubItems.map((item) => (
                                                    <SheetClose asChild key={item.label}>
                                                        <Link href={item.href} className="text-base text-muted-foreground">
                                                            {item.label}
                                                        </Link>
                                                    </SheetClose>
                                                ))}
                                            </CollapsibleContent>
                                        </Collapsible>
                                        <SheetClose asChild>
                                            <Link href="/placement" className="text-base font-semibold text-primary">
                                                Campus Placement
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Button variant="outline" asChild className="w-full mt-4">
                                                <Link href="/login">Admin Panel</Link>
                                            </Button>
                                        </SheetClose>
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex h-10 w-56" />
                        <div className="h-10 w-28 rounded-md" />
                    </div>
                )}
            </div>
        </header>
    );
}
