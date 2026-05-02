import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Connectivity check
export async function testFirestoreConnection() {
  try {
    // Attempting to read a non-existent document to trigger a light-weight server check
    await getDocFromServer(doc(db, '_connection_test_', 'check'));
    console.log('Firebase connection verified');
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.warn('Firebase client is offline. Check your internet connection or Firebase setup.');
    } else {
      console.error('Firebase connection error:', error);
    }
  }
}
