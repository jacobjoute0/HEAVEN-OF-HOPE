import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

let firebaseApp;

function configureFirebaseEmulators() {
  if (process.env.USE_FIREBASE_EMULATOR !== 'true') {
    return;
  }

  const emulatorHost = process.env.FIREBASE_EMULATOR_HOST || '127.0.0.1';
  const authPort = process.env.FIREBASE_AUTH_EMULATOR_PORT || '9100';
  const firestorePort = process.env.FIRESTORE_EMULATOR_PORT || '8089';
  const storagePort = process.env.FIREBASE_STORAGE_EMULATOR_PORT || '9200';

  process.env.FIREBASE_AUTH_EMULATOR_HOST ||= `${emulatorHost}:${authPort}`;
  process.env.FIRESTORE_EMULATOR_HOST ||= `${emulatorHost}:${firestorePort}`;
  process.env.FIREBASE_STORAGE_EMULATOR_HOST ||= `${emulatorHost}:${storagePort}`;
}

export function initFirebase() {
  if (admin.apps.length > 0) {
    firebaseApp = admin.app();
    return firebaseApp;
  }

  configureFirebaseEmulators();

  const serviceAccountPath = join(__dirname, '../serviceAccountKey.json');
  let credential;

  try {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    credential = admin.credential.cert(serviceAccount);
  } catch (err) {
    console.warn('serviceAccountKey.json not found, falling back to applicationDefault():', err.message);
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
