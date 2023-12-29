// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, collection, addDoc} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

/* const firebaseConfig = {
  apiKey: "AIzaSyAgbOwN82nOnMm2TQtlAIEkObBbtaH9okw",
  authDomain: "ticketforce-87c1d.firebaseapp.com",
  projectId: "ticketforce-87c1d",
  storageBucket: "ticketforce-87c1d.appspot.com",
  messagingSenderId: "389530136369",
  appId: "1:389530136369:web:2bf5bdcc84ebbc86474a10"
}; */
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
const db = getFirestore(app);

    
document.getElementById("btnSave").addEventListener("click", async function (e) {
    e.preventDefault();

    var violationInput = document.getElementById("vioName");
    var amountInput = document.getElementById("amount");

    var violation = violationInput.value.trim().toLowerCase();
    var amountV = amountInput.value.trim().toLowerCase();

    // Check if both fields are not empty
    if (violation === "" || amountV === "") {
        alert("Please fill in both fields before saving.");
        return; // Exit the function if any field is empty
    }
    
    try {
        
        const docRef = await addDoc(collection(db, "Violations"), {
            name: violation,
            amount: amountV
        });

        alert("violation added!");
           // Clear input fields
           violationInput.value = "";
           amountInput.value = "";

    } catch (error) {
        alert("Error adding document: ", error);
    }
});



