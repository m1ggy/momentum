import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const config = {
  apiKey: "AIzaSyBW3rTM7mr0Fxda9QoImsENst3JdyWnmDk",
  authDomain: "momentum-d4128.firebaseapp.com",
  projectId: "momentum-d4128",
  storageBucket: "momentum-d4128.firebasestorage.app",
  messagingSenderId: "713681101699",
  appId: "1:713681101699:web:b31976b255a670e8434cb6",
};

export const app = initializeApp(config);
export const auth = getAuth(app);
