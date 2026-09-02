import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { candidateService } from '@/services/candidate.service';
import { documentService } from '@/services/document.service';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  Building,
  Mail,
  Globe,
  Linkedin,
  Award,
  Code,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AppConfig } from '@/config/app.config';

type Props = {
  params: { candidateId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await candidateService.getCandidateProfile(
    params.candidateId,
  );

  if (!profile) {
    return { title: 'Profile Not Found' };
  }

  const { candidate } = profile;
  const title = `${candidate.name} | Professional Profile`;
  const description = `View the professional profile of ${candidate.name}, a skilled professional with experience as a ${candidate.jobTitle}.`;
  const ogImage = candidate.avatarUrl || `${AppConfig.baseUrl}/og-image.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `/profiles/${candidate.id}`,
      images: [
        {
          url: ogImage,
          width: 256,
          height: 256,
          alt: candidate.name,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const profileData = await candidateService.getCandidateProfile(
    params.candidateId,
  );
  if (!profileData) {
    notFound();
  }

  const { candidate } = profileData;
  const { parsedData } = candidate;

  // Fetch verified training certificates
  const allDocs = await documentService.getDocumentsForCandidate(candidate.id);
  const verifiedCertificates = allDocs.filter(
    (doc) => doc.type === 'TRAINING_CERTIFICATE' && doc.status === 'VERIFIED',
  );

  const profileJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: candidate.name,
    jobTitle: candidate.jobTitle,
    email: `mailto:${candidate.email}`,
    image: candidate.avatarUrl,
    url: `/profiles/${candidate.id}`,
    worksFor: {
      '@type': 'Organization',
      name: 'Baalvion Industries',
    },
    knowsAbout: parsedData?.skills.concat(parsedData.technologies),
  };

  return (
    <div className="bg-muted/40 py-16 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader className="text-center items-center pt-10">
            <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
              <AvatarImage src={candidate.avatarUrl} alt={candidate.name} />
              <AvatarFallback className="text-5xl">
                {candidate.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-4xl font-bold mt-4">
              {candidate.name}
            </CardTitle>
            <CardDescription className="text-xl text-muted-foreground">
              {candidate.jobTitle}
            </CardDescription>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Building className="h-4 w-4" /> Baalvion Industries
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" /> {candidate.email}
              </div>
              {parsedData?.linkedin && (
                <div className="flex items-center gap-1.5">
                  <Linkedin className="h-4 w-4" />
                  <Link
                    href={parsedData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    LinkedIn Profile
                  </Link>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {candidate.summary && (
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                  Professional Summary
                </h3>
                <p className="text-muted-foreground italic">
                  "{candidate.summary}"
                </p>
              </div>
            )}

            {parsedData && (
              <>
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center gap-2">
                    <Code className="h-5 w-5" /> Key Skills & Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {parsedData.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                    {parsedData.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {parsedData.workExperience.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center gap-2">
                      <Briefcase className="h-5 w-5" /> Work Experience
                    </h3>
                    <div className="space-y-4">
                      {parsedData.workExperience.map((exp, index) => (
                        <div key={index}>
                          <p className="font-semibold">
                            {exp.role} at {exp.company}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {exp.startDate} - {exp.endDate}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {verifiedCertificates.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5" /> Verified Certificates
                    </h3>
                    <div className="space-y-2">
                      {verifiedCertificates.map((cert) => (
                        <div
                          key={cert.id}
                          className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <p className="text-sm font-medium">{cert.name}</p>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={cert.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View <ExternalLink className="h-3 w-3 ml-1.5" />
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
