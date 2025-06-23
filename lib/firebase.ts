// lib/firebase.ts
import admin from "firebase-admin"

function initFirebase() {
  if (admin.apps.length) return

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env

  /**
   * Vercel stores secrets as single-line strings.  We:
   * 1. Ensure the private key exists.
   * 2. Replace literal \n with real new-lines.
   * 3. Remove any surrounding quotes that may have been added in the
   *    dashboard UI.
   */
  const cleanedKey = FIREBASE_PRIVATE_KEY && FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n").replace(/(^"|"$)/g, "")

  try {
    if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && cleanedKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey: cleanedKey,
        }),
      })
    } else {
      // Fallback to application-default credentials so the build doesn’t crash.
      admin.initializeApp()
    }
  } catch (err) {
    console.error("Firebase initialization error:", err)
    // Ensure the build does not crash.
    if (!admin.apps.length) admin.initializeApp()
  }
}

initFirebase()

const db = admin.firestore()

export { admin, db }
