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
  apiKey: "AIzaSyDkK38diMpaSw9bL3G2SkPVDk9gk45Jy2A",
  authDomain: "moneymanagement-user.firebaseapp.com",
  projectId: "moneymanagement-user",
  storageBucket: "moneymanagement-user.firebasestorage.app",
  messagingSenderId: "780360383116",
  appId: "1:780360383116:web:d8a332231a1c4a53af99a9",
  databaseURL: "https://moneymanagement-user-default-rtdb.asia-southeast1.firebasedatabase.app/"
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