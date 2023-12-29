   // Import the functions you need from the SDKs you need
   import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
   // TODO: Add SDKs for Firebase products that you want to use
   // https://firebase.google.com/docs/web/setup#available-libraries

   // Your web app's Firebase configuration
   const firebaseConfig = {
    apiKey: "AIzaSyAuH9VHIHMBwrTOaUg2MZau4qsCpbVFSn4",
    authDomain: "ticketforce-5ac87.firebaseapp.com",
    projectId: "ticketforce-5ac87",
    storageBucket: "ticketforce-5ac87.appspot.com",
    messagingSenderId: "185677887310",
    appId: "1:185677887310:android:5c2d30b29f40ee6063901f"
  };
  

   // Initialize Firebase
   const app = initializeApp(firebaseConfig);

/// Import Firestore functions from Firebase Firestore
import { getFirestore, query, where, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Initialize Firebase Firestore
const db = getFirestore(app);
const userNameElement = document.getElementById("userName");
const roleElement = document.getElementById("role");

export async function checkUserInCollection(uid, collectionName) {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(query(collectionRef, where("uid", "==", uid)));

    return snapshot.size > 0;
}

// Function to get the user's name by UID
export const getNameByUid = async (uid) => {
    // Check 'cashiers' collection
    const cashiersCollection = collection(db, "cashiers");
    const cashiersQuery = query(cashiersCollection, where("uid", "==", uid));
    const cashiersSnapshot = await getDocs(cashiersQuery);

    if (cashiersSnapshot.size > 0) {
        cashiersSnapshot.forEach(doc => {
            const data = doc.data();
            const name = data.name;
            userNameElement.textContent = name;
            roleElement.textContent ="CASHIER";
            console.log("User's Name (Cashiers):", name);
        });
    } else {
        // If not found in 'cashiers', check 'admins' collection
        const adminsCollection = collection(db, "admins");
        const adminsQuery = query(adminsCollection, where("uid", "==", uid));
        const adminsSnapshot = await getDocs(adminsQuery);

        if (adminsSnapshot.size > 0) {
            adminsSnapshot.forEach(doc => {
                const data = doc.data();
                const name = data.name;
                userNameElement.textContent = name;
                userNameElement.textContent = name;
             roleElement.textContent ="ADMIN";
                console.log("User's Name (Admins):", name);
               
            });
        } else {
            console.log("User not found in the 'cashiers' or 'admins' collection.");
        }
    }
};
