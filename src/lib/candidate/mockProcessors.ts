
import { doc, getFirestore, serverTimestamp, updateDoc } from "firebase/firestore";
import { updateDocumentNonBlocking } from "@/firebase";
import { parseResumeText } from "../parsing/resumeParser";
import { calculateMatchScore } from "../scoring/matchEngine";
import { generateCandidateSummary } from "@/ai/flows/generate-candidate-summary-flow";

// This simulates a background job triggered by a Cloud Function.
// We use timeouts to mock the async nature.

async function mockFetchResumeText(resumeUrl: string): Promise<string> {
    // In a real function, you'd download from the URL and extract text.
    await new Promise(resolve => setTimeout(resolve, 500));
    // A more detailed resume text for better parsing results
    return `Jane Doe
jane.doe@example.com | 555-123-4567 | linkedin.com/in/janedoe | github.com/janedoe

Highly skilled Senior Software Engineer with 8+ years of experience in building scalable web applications. Proficient in React, TypeScript, and Node.js.

Experience
Google at Mountain View
(Jan 2020 – Present)
- Led a team to develop a new feature using React and Next.js.

Microsoft at Redmond
(Jun 2016 – Dec 2019)
- Worked on the Azure portal with TypeScript and C#.

Education
Stanford University
(2014 – 2016)
- Master's in Computer Science

Skills
Languages: JavaScript, TypeScript, Python, SQL
Technologies: React, Node.js, Next.js, Docker, Kubernetes, AWS, PostgreSQL
Methodologies: Agile, Scrum, CI/CD
`;
}

export async function runMockCandidateProcessing(candidateId: string, resumeUrl: string) {
    const db = getFirestore();
    const candidateRef = doc(db, "candidates", candidateId);

    // 1. Fetch resume text (mock)
    const resumeText = await mockFetchResumeText(resumeUrl);
    updateDocumentNonBlocking(candidateRef, { resumeText });


    // 2. Trigger parsing, scoring, etc. in parallel (fire and forget)
    
    // Deterministic Resume Parsing
    setTimeout(() => {
        try {
            const parsedResult = parseResumeText(resumeText);
            if ('error' in parsedResult) {
                updateDocumentNonBlocking(candidateRef, { 
                    parsingCompleted: false, 
                    riskFlags: ["PARSING_FAILED"],
                    parsingTimestamp: serverTimestamp()
                });
            } else {
                const updatePayload = { 
                    parsedData: parsedResult, 
                    parsingCompleted: true,
                    parsingTimestamp: serverTimestamp() 
                };
                updateDocumentNonBlocking(candidateRef, updatePayload);
                
                // Trigger scoring immediately after successful parsing
                calculateMatchScore(candidateId);

            }
        } catch (e) {
            // Error handling
        }
    }, 1000);

    // AI-powered Summary Generation (can run in parallel)
    setTimeout(async () => {
        try {
            const { summary } = await generateCandidateSummary({ resumeText });
            updateDocumentNonBlocking(candidateRef, { summary });
        } catch (e) { 
            // Error handling
        }
    }, 2000);
    
    // Simple Risk Detection (can be enhanced in the parser)
    setTimeout(() => {
        const riskFlags: string[] = [];
        if (resumeText.includes("short-term")) riskFlags.push("Job hopper risk");
        if (!resumeText.includes("@")) riskFlags.push("Email may be invalid");
        updateDocumentNonBlocking(candidateRef, { riskFlags });
    }, 4000);
}
