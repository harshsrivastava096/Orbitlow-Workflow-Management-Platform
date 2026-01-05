import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();















































// const firebaseConfig = {
//   apiKey: "AIzaSyBZBsPLxHgtugULQwhsWDks81LAxa_sxlg",
//   authDomain: "prokit-8066a.firebaseapp.com",
//   projectId: "prokit-8066a",
//   storageBucket: "prokit-8066a.appspot.com",
//   messagingSenderId: "1097791431955",
//   appId: "1:1097791431955:web:da9961bbecad6aa78be6e6",
// };
