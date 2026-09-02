
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React from "react";
import { Metadata } from "next";
import { talentService } from "@/services/talent.service";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Country } from "@/lib/talent-acquisition";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with the Baalvion team. We're here to help with general inquiries, sales, partnerships, and candidate support.",
    alternates: {
        canonical: '/contact',
    },
    openGraph: {
        title: "Contact Us | TalentOS by Baalvion",
        description: "Get in touch with the Baalvion team.",
        url: '/contact'
    }
};

const ContactDetail = ({ category, contact, isLink = false }: { category: string; contact: string; isLink?: boolean }) => (
    <div>
        <p className="text-sm text-muted-foreground">{category}</p>
        <a
            href={isLink ? `https://${contact}` : `mailto:${contact}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-bold text-foreground break-words hover:underline"
        >
            {contact}
        </a>
    </div>
);

const LocationCard = ({ country, imageUrl, address }: { country: Country, imageUrl: string, address: string[] }) => (
    <div className="relative rounded-lg overflow-hidden group aspect-[407/145] text-white">
        <Image
            src={imageUrl}
            alt={`Cityscape of ${country.name}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            data-ai-hint="cityscape"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col justify-center p-6">
            <h3 className="text-2xl font-bold">{country.name}</h3>
            {address.map((line, index) => (
              <p key={index} className="text-sm mt-1">{line}</p>
            ))}
        </div>
    </div>
);


export default async function ContactPage() {
    const countries = await talentService.getCountries({ isActive: true });
    const mockAddresses: { [key: string]: string[] } = {
        "country_in": ["Prestige Tech Park", "Bengaluru, 560103"],
        "country_us": ["123 Market Street", "San Francisco, CA 94105"],
        "country_gb": ["South Bank", "London, SE1 9GY"],
        "country_ca": ["1 Bloor Street East", "Toronto, ON M4W 1A9"],
        "country_pl": ["al. Jerozolimskie 98", "00-807 Warszawa"],
        "country_au": ["100 Pitt Street", "Sydney, NSW 2000"],
        "country_vn": ["District 1", "Ho Chi Minh City"],
        "country_ph": ["Ayala Avenue", "Makati, 1226 Metro Manila"],
        "country_ua": ["Khreshchatyk St, 1/2", "Kyiv, 01001"],
    };

    return (
        <main className="bg-muted/40 py-20 lg:py-32">
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-16">

                {/* LOCATIONS SECTION */}
                <div className="lg:col-span-3 space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold uppercase text-destructive tracking-wider">Our Locations</h2>
                        <Separator className="mt-2 w-16 h-1 bg-destructive" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {countries.map((country, index) => (
                             <LocationCard 
                                key={country.id}
                                country={country}
                                imageUrl={`https://picsum.photos/seed/${index + 20}/407/145`}
                                address={mockAddresses[country.id] || [country.name]}
                             />
                        ))}
                    </div>
                </div>

                {/* CONTACT SECTION */}
                 <div className="lg:col-span-2 space-y-12">
                    <div>
                        <h2 className="text-2xl font-bold uppercase text-destructive tracking-wider">Contact</h2>
                        <Separator className="mt-2 w-16 h-1 bg-destructive" />
                    </div>
                    <div className="space-y-6">
                        <ContactDetail category="Business" contact="biz@baalvion.com" />
                        <ContactDetail category="Press & Content Creators" contact="media@baalvion.com" />
                        <ContactDetail category="Investors" contact="ir@baalvion.com" />
                        <ContactDetail category="Job Offers" contact="jobs@baalvion.com" />
                        <ContactDetail category="Technical Support" contact="support.baalvion.com" isLink />
                        <ContactDetail category="Product Safety" contact="baalvion.com/product-safety" isLink />
                        <ContactDetail category="Community" contact="contact.community@baalvion.com" />
                    </div>
                     <Button size="lg" variant="destructive" className="w-full text-lg">
                        Visit Our Press Center
                    </Button>
                </div>
            </div>
        </main>
    )
}
