import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB_2GuJ6yd9A70-zhguW-PwzaSRDD3h3LI",
    authDomain: "cloud-app-dev-amen.firebaseapp.com",
    projectId: "cloud-app-dev-amen",
    storageBucket: "cloud-app-dev-amen.firebasestorage.app",
    messagingSenderId: "500799545780",
    appId: "1:500799545780:web:314bd11d92e50107bed2e1",
    measurementId: "G-HTJFV0F76N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInWithEmailAndPassword };
