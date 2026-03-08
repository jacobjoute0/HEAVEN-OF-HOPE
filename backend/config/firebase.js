import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

let firebaseApp;

export function initFirebase() {
  if (admin.apps.length > 0) {
    firebaseApp = admin.app();
    return firebaseApp;
  }

  const serviceAccountPath = join(__dirname, '../serviceAccountKey.json');
  let credential;

  try {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    credential = admin.credential.cert(serviceAccount);
  } catch {
    credential = admin.credential.applicationDefault();
  }

  firebaseApp = admin.initializeApp({
    credential,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

  return firebaseApp;
}

export function getFirestore() {
  if (!firebaseApp) initFirebase();
  return admin.firestore();
}

export function getAuth() {
  if (!firebaseApp) initFirebase();
  return admin.auth();
}

export default { initFirebase, getFirestore, getAuth };
