   // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, query, where, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Reference to the "Record" collection
const recordCollection = collection(db, "Record");

// Retrieve all documents from the "Record" collection
const querySnapshot = await getDocs(recordCollection);
// Access the table body to append rows
// Access the table body to append rows
const tableBody = document.getElementById("tbl_home").getElementsByTagName("tbody")[0];
let counter = 0;


// Check if there is at least one document in the collection
if (!querySnapshot.empty) {
    // Loop through each document in the collection
    querySnapshot.forEach(async (doc) => {
        counter++;
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
            const driverStatus = docData.status;
            const timestamp = docData.dateTime.toMillis(); // Convert timestamp to milliseconds
            const formattedDate = new Date(timestamp).toLocaleDateString();

            // Create a new table row and cells
            const newRow = tableBody.insertRow(-1);
            const enforcerCell = newRow.insertCell(0);
            const driverCell = newRow.insertCell(1);
            const dateCell = newRow.insertCell(2);
            const statusCell = newRow.insertCell(3);

            // Set the text content of the cells
            enforcerCell.textContent = enforcerName; // Replace with actual data
            driverCell.textContent = driverName;
            dateCell.textContent = formattedDate; // Replace with actual data
            statusCell.textContent = driverStatus; // Replace with actual data
        } else {
            console.error("No matching enforcer found for uid:", enforcerUid);
        }
    });
} else {
    console.error("No documents found in the 'Record' collection.");
}





async function countPaidStatusDocumentsAndDisplay() {
    try {
      // Reference to the "Record" collection
      const recordCollection = collection(db, "Record");
  
      // Query to find documents where the status is 'paid'
      const paidStatusQuery = query(recordCollection, where("status", "==", "paid"));
  
      // Retrieve documents that match the query
      const paidStatusSnapshot = await getDocs(paidStatusQuery);
  
      // Access the transaction container to append transaction items
      const transactionContainer = document.querySelector(".transactionContainer ul");
  
      // Loop through each document with 'paid' status
      paidStatusSnapshot.forEach((doc) => {
        // Get the data from the current document
        const docData = doc.data();
        const driverName = docData.name;
  
        // Display the name and payment amount in the HTML
        const transactionItem = document.createElement("li");
        transactionItem.textContent = `${driverName} has paid ${docData.paymentAmount}`;
        transactionContainer.appendChild(transactionItem);
      });
  
      // Return the count of documents with 'paid' status
      return paidStatusSnapshot.size;
    } catch (error) {
      console.error("Error counting 'paid' status documents:", error);
      return 0; // Return 0 in case of an error
    }
  }
  
  // Call the countPaidStatusDocumentsAndDisplay function to get the count and display names/payment amounts
  const paidStatusCount = await countPaidStatusDocumentsAndDisplay();
  
  // Display the count or use it as needed
  console.log("Number of documents with 'paid' status:", paidStatusCount);
  
  export const paidStatus = paidStatusCount;
  export const countervalue = counter;



  
// Step 1: Get the start and end timestamps for the current date
const currentDate = new Date();
const startTimestamp = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0);
const endTimestamp = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 0, 0, 0, 0);
let test = 0;
// Step 2: Query Firestore to retrieve documents with a timestamp within the current date
const dateQuery = query(recordCollection, where("dateTime", ">=", startTimestamp), where("dateTime", "<", endTimestamp));
const dateQuerySnapshot = await getDocs(dateQuery);

// Step 3: Display the retrieved data to the console or your webpage
if (!dateQuerySnapshot.empty) {
    dateQuerySnapshot.forEach(async (doc) => {
        const timestamp = doc.data().dateTime.toMillis(); // Convert timestamp to milliseconds
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZone: 'UTC'  // Adjust the timezone if needed
        }).format(timestamp);
        test++;
        console.log('Status:', doc.data());
    });
} else {
    console.log("No documents found for the current date in the 'Record' collection.");
}

document.getElementById("currentData").textContent = test.toString();