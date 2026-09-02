'use client';

import Link from 'next/link';
import { Logo } from './logo';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const footerLinkConfig = {
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact' },
    { href: '/about/team', label: 'Team' },
    { href: '/studio', label: 'Studio' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/data-protection', label: 'Data Protection' },
    { href: '/terms', label: 'Terms of Service' },
  ],
  resources: [
    { href: '/faqs', label: 'FAQs' },
    { href: '/careers/hiring-process', label: 'Hiring Process' },
    { href: '/careers/open-positions', label: 'Open Positions' },
  ],
};

export function PublicFooter() {
  return (
    <footer className="bg-muted/40 border-t">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Building the intelligent infrastructure that connects exceptional talent with borderless opportunity.
            </p>
             <div className="mt-6">
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Subscribe to our newsletter</h3>
                <p className="text-sm text-muted-foreground mt-1">Get the latest news on open roles and company updates.</p>
                <form className="mt-4 flex w-full max-w-sm items-center space-x-2">
                    <Input type="email" placeholder="Email" />
                    <Button type="submit">Subscribe</Button>
                </form>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-3">
                {footerLinkConfig.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-base text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-3">
                {footerLinkConfig.legal.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-base text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-3">
                {footerLinkConfig.resources.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-base text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-16 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Baalvion Industries Pvt Ltd. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
