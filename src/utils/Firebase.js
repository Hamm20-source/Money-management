// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { ref, get } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);

// Fetch GridTransactions
export async function fetchIncome(uid) {
  if (!uid) return [];
  const dbRef = ref(database, `transactions/${uid}/income`);
  const snapshot = await get(dbRef);

  if (!snapshot.exists()) return [];
  const data = snapshot.val();

  return Object.keys(data).map(key => ({
    id: key,
    ...data[key],
    nominal: Number(data[key].nominal) || 0,
  }));
}

export async function fetchExpense(uid) {
  if (!uid) return [];
  const dbRef = ref(database, `transactions/${uid}/expense`);
  const snapshot = await get(dbRef);

  if (!snapshot.exists()) return [];
  const data = snapshot.val();

  return Object.keys(data).map(key => ({
    id: key,
    ...data[key],
    nominal: Number(data[key].nominal) || 0,
  }));
};

//get firestore detail
export async function getUserByEmail(email) {
  if (!email) return null;

  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("User not found");
      return null;
    }
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error("Error getting user", error);
    return null;
  }
};

export {auth, db, database, storage}