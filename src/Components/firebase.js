// firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCkeUJpOP5ZESTTpJwwx_0blIZf1F7wugY",
  authDomain: "yugiweb-c26a9.firebaseapp.com",
  projectId: "yugiweb-c26a9",
  storageBucket: "yugiweb-c26a9.firebasestorage.app",
  messagingSenderId: "266042624122",
  appId: "1:266042624122:web:bb59d704e3903d17ea93c3",
  measurementId: "G-YQWZ5RWF3M",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, provider, facebookProvider };
