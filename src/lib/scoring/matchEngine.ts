
'use server';

import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { getAllJobs } from '@/domain/talent/jobs.data';
import type { Candidate, FitCategory, Job, ScoreBreakdown } from '@/types';
import { SCORING_WEIGHTS } from '@/config/scoringWeights';

import { calculateCultureScore } from './cultureMatcher';
import { calculateEducationScore } from './educationMatcher';
import { calculateExperienceScore } from './experienceMatcher';
import { calculateIndustryScore } from './industryMatcher';
import { calculateLocationScore } from './locationMatcher';
import { calculateSeniorityScore } from './seniorityMatcher';
import { calculateSkillScore } from './skillMatcher';

function getFitCategory(score: number): FitCategory {
    if (score >= 85) return "STRONG_FIT";
    if (score >= 70) return "GOOD_FIT";
    if (score >= 50) return "MODERATE_FIT";
    return "WEAK_FIT";
}


export async function calculateMatchScore(candidateId: string) {
    const { firestore } = initializeFirebase();
    const candidateRef = doc(firestore, 'candidates', candidateId);

    try {
        const candidateSnap = await getDoc(candidateRef);
        if (!candidateSnap.exists()) {
            throw new Error(`Candidate with ID ${candidateId} not found.`);
        }

        const candidate = candidateSnap.data() as Candidate;

        // In a real app, this would be a Firestore query. Using mock jobs for now.
        const job = getAllJobs().find((j: Job) => j.id === candidate.jobId);

        if (!job) {
            throw new Error(`Job with ID ${candidate.jobId} not found for candidate ${candidateId}.`);
        }

        if (!candidate.parsedData) {
            return;
        }

        // 1. Calculate individual scores
        const breakdown: ScoreBreakdown = {
            skillMatch: calculateSkillScore(candidate, job),
            experienceMatch: calculateExperienceScore(candidate, job),
            seniorityMatch: calculateSeniorityScore(candidate, job),
            educationMatch: calculateEducationScore(candidate, job),
            locationMatch: calculateLocationScore(candidate, job),
            industryMatch: calculateIndustryScore(candidate, job),
            cultureMatch: calculateCultureScore(candidate, job),
        };

        // 2. Apply weights and sum up
        let finalScore = 0;
        finalScore += (breakdown.skillMatch / 100) * SCORING_WEIGHTS.skillMatch;
        finalScore += (breakdown.experienceMatch / 100) * SCORING_WEIGHTS.experienceMatch;
        finalScore += (breakdown.seniorityMatch / 100) * SCORING_WEIGHTS.seniorityMatch;
        finalScore += (breakdown.educationMatch / 100) * SCORING_WEIGHTS.educationMatch;
        finalScore += (breakdown.locationMatch / 100) * SCORING_WEIGHTS.locationMatch;
        finalScore += (breakdown.industryMatch / 100) * SCORING_WEIGHTS.industryMatch;
        finalScore += (breakdown.cultureMatch / 100) * SCORING_WEIGHTS.cultureMatch;

        // 3. Apply confidence adjustment
        const confidence = candidate.parsedData.confidenceScore || 100;
        if (confidence < 40) {
            finalScore *= 0.8; // Reduce by 20%
        } else if (confidence < 60) {
            finalScore *= 0.9; // Reduce by 10%
        }

        finalScore = Math.round(finalScore);

        // 4. Get fit category
        const fitCategory = getFitCategory(finalScore);

        // 5. Update Firestore document (non-blocking)
        const updatePayload = {
            matchScore: finalScore,
            scoreBreakdown: breakdown,
            fitCategory,
            scoringCompleted: true,
            scoringTimestamp: serverTimestamp(),
        };

        updateDocumentNonBlocking(candidateRef, updatePayload);

        return finalScore;

    } catch (error) {
        updateDocumentNonBlocking(candidateRef, {
            scoringCompleted: false,
            riskFlags: ['SCORING_FAILED']
        });
    }
}
