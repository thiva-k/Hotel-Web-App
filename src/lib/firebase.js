import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCouDXMUzilnf0mmZVn9SC_plG8B384Hqs",
  authDomain: "hotelwebapp-dd5bb.firebaseapp.com",
  projectId: "hotelwebapp-dd5bb",
  storageBucket: "hotelwebapp-dd5bb.appspot.com",
  messagingSenderId: "1033293584112",
  appId: "1:1033293584112:web:38953e0b95147c89b89435"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage();

export { auth, provider, db, storage };
