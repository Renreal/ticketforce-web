// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, query, where, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAuH9VHIHMBwrTOaUg2MZau4qsCpbVFSn4",
    authDomain: "ticketforce-5ac87.firebaseapp.com",
    projectId: "ticketforce-5ac87",
    storageBucket: "ticketforce-5ac87.appspot.com",
    messagingSenderId: "185677887310",
    appId: "1:185677887310:android:5c2d30b29f40ee6063901f"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Reference to the "Record" collection
const recordCollection = collection(db, "Record");

// Retrieve all documents from the "Record" collection
const querySnapshot = await getDocs(recordCollection);

// Access the transaction container to append transaction items
const transactionContainer = document.querySelector(".Tcontainer");
querySnapshot.forEach(async (doc) => {
    // Get the data from the current document
    const docData = doc.data();
    const driverName = docData.name;
    const paymentAmount = docData.paymentAmount;
    const timestamp = docData.dateTime.toMillis(); // Convert timestamp to milliseconds
    const formattedDate = new Date(timestamp).toLocaleDateString();
    const formattedTime = new Date(timestamp).toLocaleTimeString();

    // Create a new transaction item
    const transactionItem = document.createElement("div");
    transactionItem.className = "Tdata";
    transactionItem.innerHTML = `<a><img src="envelope.jpg" alt="envelope icon"><p class="status">${driverName} has paid ${paymentAmount}</p></a>
                                  <div class="dateTime">
                                    <p class="Tdate">${formattedDate}</p>
                                    <p class="Ttime">${formattedTime}</p>
                                  </div>`;
    transactionContainer.appendChild(transactionItem);
});

// Display the count or use it as needed
console.log("Number of documents with 'paid' status:", querySnapshot.size);