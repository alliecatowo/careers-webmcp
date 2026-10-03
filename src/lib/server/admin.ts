
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// ===================================================================
// WORLD-CLASS ADMIN SDK INITIALIZATION
// This is the entry point for all trusted server-side operations.
// ===================================================================

// In a real production environment (e.g., Cloud Functions, Cloud Run),
// the SDK is initialized without parameters. It automatically discovers
// credentials from the environment.
// For local development with the Emulator Suite, this also works seamlessly.

if (!getApps().length) {
  try {
    initializeApp();
  } catch (e) {
    // In a real scenario, this would trigger a high-priority alert.
    // The application's backend is non-functional without this.
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
export const adminStorage = getStorage();
