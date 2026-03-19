import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google provider with force account picker
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account", // Force account picker every time
});

/**
 * Sign in with Google popup
 * @returns {Promise<{token: string, user: object}>} Firebase ID token and user info
 * @throws {Error} With user-friendly message for various error cases
 */
export async function signInWithGoogle() {
  try {
    // Sign out first to ensure fresh account selection (ignore errors)
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Pre-signout failed (ignorable):", e);
    }

    // Clear any stale auth state
    await auth.authStateReady();

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Get Firebase ID token to send to backend
    const token = await user.getIdToken(true); // force refresh

    if (!token) {
      throw new Error("Failed to get authentication token");
    }

    return {
      token,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
    };
  } catch (error) {
    // Handle specific Firebase auth errors with user-friendly messages
    const errorCode = error.code;

    switch (errorCode) {
      case "auth/popup-closed-by-user":
        throw new Error("Sign-in cancelled. Please try again.");

      case "auth/popup-blocked":
        throw new Error("Popup was blocked. Please allow popups for this site and try again.");

      case "auth/cancelled-popup-request":
        throw new Error("Sign-in cancelled. Please try again.");

      case "auth/network-request-failed":
        throw new Error("Network error. Please check your internet connection.");

      case "auth/too-many-requests":
        throw new Error("Too many attempts. Please wait a moment and try again.");

      case "auth/user-disabled":
        throw new Error("This account has been disabled. Please contact support.");

      case "auth/operation-not-allowed":
        throw new Error("Google sign-in is not enabled. Please contact support.");

      case "auth/internal-error":
        // Clear auth state and suggest retry
        try { await signOut(auth); } catch (e) { /* ignore */ }
        throw new Error("Authentication error. Please try again.");

      default:
        // Log the actual error for debugging
        console.error("Google sign-in error:", errorCode, error.message);
        throw new Error(error.message || "Google sign-in failed. Please try again.");
    }
  }
}

/**
 * Sign out from Firebase (clears Firebase auth state)
 */
export async function signOutFromFirebase() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Firebase sign-out error:", error);
  }
}

export { auth };
