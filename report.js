        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

        const firebaseConfig = {
            apiKey: "AIzaSyAuH9VHIHMBwrTOaUg2MZau4qsCpbVFSn4",
            authDomain: "ticketforce-5ac87.firebaseapp.com",
            projectId: "ticketforce-5ac87",
            storageBucket: "ticketforce-5ac87.appspot.com",
            messagingSenderId: "185677887310",
            appId: "1:185677887310:android:5c2d30b29f40ee6063901f"
        };
        // Initialize Firebase

        
        /// Import Firestore functions from Firebase Firestore
        import { getFirestore, query, where, getDocs, collection, deleteDoc, doc} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
       

        // Initialize Firebase auth and firestore
      const app = initializeApp(firebaseConfig);
     const db = getFirestore(app);
        
  
  
  
  
     // Reference to the "Record" collection
const recordCollection = collection(db, "Record");

// Retrieve all documents from the "Record" collection
const querySnapshot = await getDocs(recordCollection);


// Access the table body of the second table to append rows
const tableBody2 = document.getElementById("tableBody").getElementsByTagName("tbody")[0];

// Check if there is at least one document in the collection
if (!querySnapshot.empty) {
    // Loop through each document in the collection
    querySnapshot.forEach(async (doc) => {
        // Get the data from the current document
        const docData = doc.data();
        
        const enforcerUid = docData.uid;

        // Reference to the "enforcers" collection
        const enforcersCollection = collection(db, "enforcers");

        // Query to find the enforcer with the matching uid
        const enforcerQuery = query(enforcersCollection, where("uid", "==", enforcerUid));
        const enforcerQuerySnapshot = await getDocs(enforcerQuery);

        // Check if there is at least one matching enforcer
        if (!enforcerQuerySnapshot.empty) {
            const matchingEnforcer = enforcerQuerySnapshot.docs[0].data();
            const enforcerName = `${matchingEnforcer.firstname} ${matchingEnforcer.lastname}`;
            
            const driverName = docData.name;
            const timestamp = docData.dateTime.toMillis(); // Convert timestamp to milliseconds
            const formattedDate = new Date(timestamp).toLocaleDateString();

            const violationsArray = docData.violations || [];

            // Create a new table row and cells for the second table for each violation
            violationsArray.forEach((violation) => {
                const newRow2 = tableBody2.insertRow(-1);
                const dateCell2 = newRow2.insertCell(0);
                const enforcerCell2 = newRow2.insertCell(1);
                const violationCell = newRow2.insertCell(2);
                const violationFeeCell = newRow2.insertCell(3);
                const paymentDateCell = newRow2.insertCell(4);
                const collectedFeeCell = newRow2.insertCell(5);
                const remarksCell = newRow2.insertCell(6);

                // Set the text content of the cells for the second table
                dateCell2.textContent = formattedDate;
                enforcerCell2.textContent = enforcerName;
                violationCell.textContent = violation["Name of Violation"];
                violationFeeCell.textContent = violation["Amount"];
                paymentDateCell.textContent = formattedDate;
                collectedFeeCell.textContent = "null"; // Replace with actual data
                remarksCell.textContent = "null"; // Replace with actual data
            });

        } else {
            console.error("No matching enforcer found for uid:", enforcerUid);
        }
    });
} else {
    console.error("No documents found in the 'Record' collection.");
}