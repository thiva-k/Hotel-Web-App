import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBKgbSshrxeITGDHuascD-mT0Ni_DwlFeo",
  authDomain: "restaurant-mis.firebaseapp.com",
  projectId: "restaurant-mis",
  storageBucket: "restaurant-mis.appspot.com",
  messagingSenderId: "140954246691",
  appId: "1:140954246691:web:7a5c6cb001f333f5a05b96"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage();

export { auth, provider, db, storage,app };
