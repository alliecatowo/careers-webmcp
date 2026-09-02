'use server';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Building,
  ChevronRight,
  Globe,
  Rocket,
  Search,
  Star,
  Target,
  Users,
  Users2,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { talentService } from '@/services/talent.service';
import { JobCard } from '@/modules/talent-acquisition/components/JobCard';
import { AppConfig } from '@/config/app.config';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export async function getCareersLandingMetadata(canonicalPath: string): Promise<Metadata> {
  const title = 'TalentOS by Baalvion | The Operating System for Global Talent';
  const description =
    "Join Baalvion, headquartered in India with a globally distributed workforce. We're building the intelligent infrastructure that connects exceptional talent with borderless opportunity.";
  const canonicalUrl = `${AppConfig.baseUrl}${canonicalPath}`;

  // Keep canonical-only for main careers landing to avoid cross-country hreflang duplication.
  // Country-specific URLs are not language variants; they represent region filters.
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

const whyJoinUsItems = [
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: 'Drive Innovation',
    description:
      'Work on challenging problems and build the future of global hiring with cutting-edge technology.',
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: 'Global Impact',
    description: "Be part of a diverse, global team that’s making talent acquisition borderless and more equitable.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Full Ownership',
    description:
      'We believe in empowering our team. Take ownership of your projects from idea to deployment.',
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Accelerated Growth',
    description: 'We invest in your development with a generous learning budget and opportunities for advancement.',
  },
];

const howItWorksSteps = [
  {
    icon: <Search className="h-10 w-10 text-primary" />,
    name: 'Find a Project',
    description: 'Browse our marketplace of open projects and find one that matches your skills and interests.',
  },
  {
    icon: <Users2 className="h-10 w-10 text-primary" />,
    name: 'Build Your Team',
    description: 'Apply as an individual or create a team, inviting other skilled members to collaborate.',
  },
  {
    icon: <Target className="h-10 w-10 text-primary" />,
    name: 'Deliver & Get Paid',
    description: 'Work on milestones, submit your deliverables, and get paid securely through our escrow system.',
  },
];

const platformBenefits = [
  { title: 'Access Global Talent', description: 'Connect with skilled professionals from around the world, not just your local market.' },
  { title: 'Secure Payments', description: 'Our escrow system ensures that funds are secure and payments are released only upon milestone approval.' },
  { title: 'Transparent Process', description: 'Clear milestones and open communication channels keep everyone aligned from start to finish.' },
  { title: 'Build Your Reputation', description: 'Successfully completed projects build your on-platform reputation, leading to more opportunities.' },
];

export async function CareersLanding() {
  const [countries, allJobs, departments] = await Promise.all([
    talentService.getCountries({ isActive: true }),
    talentService.getJobs({ status: 'published' }),
    talentService.getDepartments({ isActive: true }),
  ]);

  const featuredJobs = allJobs.data.filter((job) => (job as any).featured);
  const careersHeroImage = PlaceHolderImages.find((img) => img.id === 'careers-hero');

  return (
    <main className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[450px] w-full flex items-center justify-center text-center text-white">
        {careersHeroImage && (
          <Image
            src={careersHeroImage.imageUrl}
            alt={careersHeroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={careersHeroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">TalentOS by Baalvion</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-neutral-200">The Operating System for Global Talent.</p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/projects">Explore Projects</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="#how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      {featuredJobs.length > 0 && (
        <section id="featured-jobs" className="py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight flex items-center justify-center gap-3">
                <Star className="h-10 w-10 text-primary" />
                Featured Positions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">Explore our most critical and exciting opportunities right now.</p>
            </div>
            <div className="mt-16 max-w-5xl mx-auto space-y-6">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} departments={departments} countries={countries} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">A simple, transparent process for collaboration.</p>
          </div>
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
            {howItWorksSteps.map((step) => (
              <div key={step.name} className="p-6">
                {step.icon}
                <h3 className="mt-6 text-xl font-bold">{step.name}</h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Benefits Section */}
      <section id="platform-benefits" className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Why Our Platform?</h2>
            <p className="mt-4 text-lg text-muted-foreground">Built for trust, transparency, and global scale.</p>
          </div>
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {platformBenefits.map((benefit) => (
              <Card key={benefit.title} className="p-6 bg-card">
                <h3 className="text-lg font-bold">{benefit.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Careers at Baalvion Section */}
      <section className="py-24 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Careers at Baalvion</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Building global infrastructure from India to the world.</p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/careers/open-positions">See All Open Roles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Why Join Baalvion?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We are a team of builders, thinkers, and innovators on a mission to unlock the world's human potential.
            </p>
          </div>
          <div className="mt-16 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {whyJoinUsItems.map((item) => (
              <div
                key={item.title}
                className="text-center p-6 border border-transparent hover:bg-card hover:border-border rounded-lg transition-all"
              >
                {item.icon}
                <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence Grid */}
      <section id="global-presence" className="py-24 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Our Global Presence</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Baalvion is headquartered in India with a globally distributed workforce across North America, Europe, and Asia-Pacific.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((country) => (
              <Link href={`/careers/countries/${country.slug}`} key={country.id}>
                <Card className="h-full hover:border-primary hover:shadow-lg transition-all group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg">{country.name}</p>
                        {country.type === 'headquarters' ? (
                          <p className="text-sm text-primary font-semibold">Headquarters & Primary Talent Hub</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {country.hiringModel.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} Region
                          </p>
                        )}
                      </div>
                      <Building className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-sm font-semibold text-primary mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Learn More <ChevronRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

