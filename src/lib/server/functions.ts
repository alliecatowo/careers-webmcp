import * as functions from 'firebase-functions/v1';
import { adminDb } from './admin';
import {
  sendApplicationConfirmation,
  sendStageUpdateEmail,
} from '../notifications/emailMock';

// This is a simplified, secure middleware for an internal tool.
const withAdminAuth = (
  handler: (
    data: any,
    context: functions.https.CallableContext,
  ) => Promise<any>,
) => {
  return functions.https.onCall(async (data, context) => {
    if (!context?.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.',
      );
    }

    const adminUserDoc = await adminDb
      .collection('users')
      .doc(context.auth.uid)
      .get();
    const role = adminUserDoc.data()?.role;

    if (role !== 'SUPER_ADMIN') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'You do not have the required permission.',
      );
    }

    return handler(data, context);
  });
};

/**
 * Promotes a user to the RECRUITER role.
 * Only callable by a SUPER_ADMIN.
 */
export const promoteToRecruiter = withAdminAuth(async (data, context) => {
  const { uid } = data;

  if (typeof uid !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with a "uid".',
    );
  }

  try {
    const userRef = adminDb.collection('users').doc(uid);
    await userRef.update({ role: 'RECRUITER' });

    return { result: `Success! User ${uid} has been promoted to RECRUITER.` };
  } catch (error) {
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while promoting the user.',
    );
  }
});

/**
 * Background function triggered when a new application is created.
 * Sends a confirmation email and writes an audit log.
 */
export const onApplicationCreated = functions.firestore
  .document('/applications/{applicationId}')
  .onCreate(async (snap, context) => {
    const application = snap.data();

    // 1. Get Candidate and Job details
    const candidateDoc = await adminDb
      .collection('candidates')
      .doc(application.candidateId)
      .get();
    const jobDoc = await adminDb
      .collection('jobs')
      .doc(application.jobId)
      .get();

    if (!candidateDoc.exists || !jobDoc.exists) {
      return;
    }

    // 2. Send mock confirmation email
    sendApplicationConfirmation(
      candidateDoc.data() as any,
      jobDoc.data() as any,
    );

    // 3. Write to audit log
    const auditLog = {
      actionType: 'APPLICATION_SUBMITTED',
      actorId: application.candidateId,
      actorRole: 'CANDIDATE',
      targetEntity: snap.id,
      entityType: 'application',
      timestamp: new Date(),
      details: { jobId: application.jobId },
    };

    try {
      await adminDb.collection('auditLogs').add(auditLog);
    } catch (error) {
      // Error handling
    }
  });

/**
 * Background function triggered when an application's status is updated.
 */
export const onApplicationStatusChange = functions.firestore
  .document('/applications/{applicationId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== after.status) {
      // 1. Get Candidate and Job details
      const candidateDoc = await adminDb
        .collection('candidates')
        .doc(after.candidateId)
        .get();
      const jobDoc = await adminDb.collection('jobs').doc(after.jobId).get();

      if (!candidateDoc.exists || !jobDoc.exists) {
        return;
      }

      // 2. Send mock notification email
      sendStageUpdateEmail(
        candidateDoc.data() as any,
        jobDoc.data() as any,
        after.status,
      );

      // 3. Write to audit log (could be enhanced to show who made the change)
      const auditLog = {
        actionType: 'CANDIDATE_STATUS_CHANGED',
        actorId: 'system', // Placeholder - needs movedBy from app doc
        actorRole: 'RECRUITER',
        targetEntity: after.candidateId,
        entityType: 'candidate',
        timestamp: new Date(),
        details: {
          from: before.status,
          to: after.status,
          jobId: after.jobId,
        },
      };

      try {
        await adminDb.collection('auditLogs').add(auditLog);
      } catch (error) {
        // Error handling
      }
    }
  });
